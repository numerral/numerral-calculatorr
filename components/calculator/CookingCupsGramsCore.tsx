"use client";

import { useState, useEffect } from "react";

const INGREDIENTS = [
    // Flours
    { id: "flour-ap", name: "All-Purpose Flour", density: 120, category: "Flours" },
    { id: "flour-bread", name: "Bread Flour", density: 127, category: "Flours" },
    { id: "flour-cake", name: "Cake Flour", density: 114, category: "Flours" },
    { id: "flour-ww", name: "Whole Wheat Flour", density: 113, category: "Flours" },
    { id: "flour-almond", name: "Almond Flour", density: 96, category: "Flours" },
    // Sugars
    { id: "sugar-gran", name: "Granulated Sugar", density: 200, category: "Sugars" },
    { id: "sugar-brown-l", name: "Light Brown Sugar (Packed)", density: 213, category: "Sugars" },
    { id: "sugar-brown-d", name: "Dark Brown Sugar (Packed)", density: 239, category: "Sugars" },
    { id: "sugar-pow", name: "Powdered Sugar", density: 113, category: "Sugars" },
    { id: "honey", name: "Honey / Molasses", density: 340, category: "Sugars" },
    // Fats & Liquids
    { id: "butter", name: "Butter (1 stick = 0.5 cups)", density: 227, category: "Fats & Liquids" },
    { id: "oil", name: "Vegetable / Canola Oil", density: 218, category: "Fats & Liquids" },
    { id: "water", name: "Water / Milk", density: 240, category: "Fats & Liquids" },
    // Others
    { id: "cocoa", name: "Cocoa Powder", density: 100, category: "Others" },
    { id: "oats", name: "Rolled Oats", density: 85, category: "Others" },
    { id: "choc-chips", name: "Chocolate Chips", density: 170, category: "Others" },
    { id: "pb", name: "Peanut Butter", density: 250, category: "Others" },
];

export default function CookingCupsGramsCore() {
    const [ingredientId, setIngredientId] = useState<string>("flour-ap");
    const [cups, setCups] = useState<string>("1");
    const [grams, setGrams] = useState<string>("120");

    // Get current active ingredient object
    const activeIngredient = INGREDIENTS.find(i => i.id === ingredientId) || INGREDIENTS[0];

    const handleIngredientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        setIngredientId(newId);
        
        // When ingredient changes, update the grams based on the CURRENT cups value
        const ing = INGREDIENTS.find(i => i.id === newId) || INGREDIENTS[0];
        const currentCups = parseFloat(cups);
        if (!isNaN(currentCups)) {
            setGrams((currentCups * ing.density).toFixed(1));
        }
    };

    const handleCupsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCups(val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            setGrams((parsed * activeIngredient.density).toFixed(1));
        } else {
            setGrams("");
        }
    };

    const handleGramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setGrams(val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
            // Keep to 2 decimal places max for cups to avoid 0.3333333
            const newCups = (parsed / activeIngredient.density);
            setCups(Number.isInteger(newCups) ? newCups.toString() : newCups.toFixed(2));
        } else {
            setCups("");
        }
    };

    return (
        <div className="calculator-engine">
            <div className="calculator-engine__main" style={{ display: "flex", flexDirection: "column", gap: "var(--s-5)" }}>
                
                {/* Ingredient Dropdown */}
                <div className="input-group">
                    <label className="input-label" style={{ marginBottom: "var(--s-2)", display: "block" }}>Ingredient</label>
                    <select 
                        className="input-field" 
                        value={ingredientId} 
                        onChange={handleIngredientChange}
                        style={{ width: "100%", cursor: "pointer" }}
                    >
                        <optgroup label="Flours">
                            {INGREDIENTS.filter(i => i.category === "Flours").map(i => (
                                <option key={i.id} value={i.id}>{i.name}</option>
                            ))}
                        </optgroup>
                        <optgroup label="Sugars">
                            {INGREDIENTS.filter(i => i.category === "Sugars").map(i => (
                                <option key={i.id} value={i.id}>{i.name}</option>
                            ))}
                        </optgroup>
                        <optgroup label="Fats & Liquids">
                            {INGREDIENTS.filter(i => i.category === "Fats & Liquids").map(i => (
                                <option key={i.id} value={i.id}>{i.name}</option>
                            ))}
                        </optgroup>
                        <optgroup label="Others">
                            {INGREDIENTS.filter(i => i.category === "Others").map(i => (
                                <option key={i.id} value={i.id}>{i.name}</option>
                            ))}
                        </optgroup>
                    </select>
                </div>

                {/* Conversion Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "var(--s-4)", alignItems: "center" }}>
                    
                    {/* Volume (Cups) */}
                    <div className="input-group">
                        <label className="input-label" style={{ marginBottom: "var(--s-2)", display: "block", color: "var(--primary-color)" }}>Volume (US Cups)</label>
                        <div style={{ position: "relative" }}>
                            <input 
                                type="number" 
                                className="input-field" 
                                value={cups} 
                                onChange={handleCupsChange}
                                placeholder="0.0"
                                step="any"
                                style={{ width: "100%", fontSize: "1.25rem", paddingRight: "3rem" }}
                            />
                            <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--n-text-muted)", fontWeight: 500 }}>
                                c
                            </span>
                        </div>
                    </div>
                    
                    {/* Equals Sign */}
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem", color: "var(--n-border)", marginTop: "24px" }}>
                        =
                    </div>

                    {/* Weight (Grams) */}
                    <div className="input-group">
                        <label className="input-label" style={{ marginBottom: "var(--s-2)", display: "block", color: "var(--success-color)", fontWeight: 600 }}>Weight (Grams)</label>
                        <div style={{ position: "relative" }}>
                            <input 
                                type="number" 
                                className="input-field" 
                                value={grams} 
                                onChange={handleGramsChange}
                                placeholder="0.0"
                                step="any"
                                style={{ width: "100%", fontSize: "1.25rem", paddingRight: "3rem", borderColor: "var(--success-color)" }}
                            />
                            <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--success-color)", fontWeight: 600 }}>
                                g
                            </span>
                        </div>
                    </div>
                    
                </div>
                
                <p style={{ fontSize: "0.875rem", color: "var(--n-text-muted)", textAlign: "center", marginTop: "var(--s-2)" }}>
                    Conversion factor: 1 cup of <strong>{activeIngredient.name.toLowerCase()}</strong> is exactly {activeIngredient.density} grams.
                </p>

            </div>
        </div>
    );
}

"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Densities in g/ml
const INGREDIENTS = {
    "water": { name: "Water / Milk / Simple Liquids", density: 1.0 },
    "flour_ap": { name: "All-Purpose Flour (un-sifted)", density: 0.528 },
    "sugar_granulated": { name: "Granulated Sugar", density: 0.845 },
    "sugar_brown": { name: "Brown Sugar (Packed)", density: 0.930 },
    "butter": { name: "Butter", density: 0.958 },
    "salt_table": { name: "Table Salt", density: 1.217 },
    "cocoa_powder": { name: "Cocoa Powder", density: 0.422 },
};

const VOLUME_UNITS = {
    "cups": { name: "Cups (US)", toMl: 236.588 },
    "tbsp": { name: "Tablespoons (US)", toMl: 14.7868 },
    "tsp": { name: "Teaspoons (US)", toMl: 4.92892 },
    "floz": { name: "Fluid Ounces (US)", toMl: 29.5735 },
    "ml": { name: "Milliliters (ml)", toMl: 1.0 },
};

const MASS_UNITS = {
    "grams": { name: "Grams (g)", toGrams: 1.0 },
    "ounces": { name: "Ounces (oz)", toGrams: 28.3495 },
    "lbs": { name: "Pounds (lbs)", toGrams: 453.592 },
};

type UnitType = "volume" | "mass";
type AnyUnit = keyof typeof VOLUME_UNITS | keyof typeof MASS_UNITS;

interface Props {
    calculatorId?: string;
}

function ConverterLogic({ calculatorId }: Props) {
    const searchParams = useSearchParams();
    const amountParam = searchParams.get("amount");
    
    const [amount, setAmount] = useState<number>(1);
    
    // Parse defaults from ID
    const [fromUnit, setFromUnit] = useState<AnyUnit>("grams");
    const [toUnit, setToUnit] = useState<AnyUnit>("cups");
    const [ingredient, setIngredient] = useState<keyof typeof INGREDIENTS>("flour_ap");

    // Initialize from URL params if present
    useEffect(() => {
        if (amountParam) {
            let parsed = parseFloat(amountParam);
            if (amountParam.includes("/")) {
                const [n, d] = amountParam.split("/");
                if (!isNaN(Number(n)) && !isNaN(Number(d)) && Number(d) !== 0) {
                    parsed = Number(n) / Number(d);
                }
            }
            if (!isNaN(parsed) && parsed > 0) {
                setAmount(parsed);
            }
        }
    }, [amountParam]);

    useEffect(() => {
        if (!calculatorId) return;
        if (calculatorId === "grams-to-cups-converter") { setFromUnit("grams"); setToUnit("cups"); }
        if (calculatorId === "grams-to-tablespoons-converter") { setFromUnit("grams"); setToUnit("tbsp"); }
        if (calculatorId === "ounces-to-grams-converter") { setFromUnit("ounces"); setToUnit("grams"); }
        if (calculatorId === "tablespoons-to-cups-converter") { setFromUnit("tbsp"); setToUnit("cups"); }
        if (calculatorId === "teaspoons-to-tablespoons-converter") { setFromUnit("tsp"); setToUnit("tbsp"); }
    }, [calculatorId]);

    const getUnitType = (unit: AnyUnit): UnitType => {
        return (unit in VOLUME_UNITS) ? "volume" : "mass";
    };

    const results = useMemo(() => {
        const fromType = getUnitType(fromUnit);
        const toType = getUnitType(toUnit);
        
        let result = 0;

        // V to V
        if (fromType === "volume" && toType === "volume") {
            const ml = amount * VOLUME_UNITS[fromUnit as keyof typeof VOLUME_UNITS].toMl;
            result = ml / VOLUME_UNITS[toUnit as keyof typeof VOLUME_UNITS].toMl;
        } 
        // M to M
        else if (fromType === "mass" && toType === "mass") {
            const g = amount * MASS_UNITS[fromUnit as keyof typeof MASS_UNITS].toGrams;
            result = g / MASS_UNITS[toUnit as keyof typeof MASS_UNITS].toGrams;
        }
        // V to M
        else if (fromType === "volume" && toType === "mass") {
            const ml = amount * VOLUME_UNITS[fromUnit as keyof typeof VOLUME_UNITS].toMl;
            const density = INGREDIENTS[ingredient].density;
            const g = ml * density;
            result = g / MASS_UNITS[toUnit as keyof typeof MASS_UNITS].toGrams;
        }
        // M to V
        else if (fromType === "mass" && toType === "volume") {
            const g = amount * MASS_UNITS[fromUnit as keyof typeof MASS_UNITS].toGrams;
            const density = INGREDIENTS[ingredient].density;
            const ml = g / density;
            result = ml / VOLUME_UNITS[toUnit as keyof typeof VOLUME_UNITS].toMl;
        }

        // Format beautifully
        let formatted = result.toFixed(2);
        if (result < 0.01) formatted = result.toFixed(4); // tiny values
        if (Number.isInteger(result)) formatted = result.toString();

        return {
            value: formatted,
            needsIngredient: (fromType !== toType)
        };
    }, [amount, fromUnit, toUnit, ingredient]);

    const handleSwap = () => {
        const temp = fromUnit;
        setFromUnit(toUnit);
        setToUnit(temp);
    };

    return (
        <div>
            <div className="calc-input-panel">
                <div className="calc-field">
                    <label className="calc-field__label">⚖️ CONVERT FROM</label>
                    <div style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center' }}>
                        <input
                            type="number"
                            min="0"
                            step="any"
                            value={amount !== 0 ? amount : ""}
                            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                            className="calc-field__input"
                            style={{ flex: 1 }}
                        />
                        <select
                            value={fromUnit}
                            onChange={(e) => setFromUnit(e.target.value as AnyUnit)}
                            className="calc-field__input"
                            style={{ flex: 1 }}
                        >
                            <optgroup label="Volume / Liquids">
                                {Object.entries(VOLUME_UNITS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                            </optgroup>
                            <optgroup label="Mass / Weight">
                                {Object.entries(MASS_UNITS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                            </optgroup>
                        </select>
                    </div>
                </div>

                <div className="calc-field">
                    <label className="calc-field__label">🏁 CONVERT TO</label>
                    <div style={{ display: 'flex', gap: 'var(--s-2)', alignItems: 'center' }}>
                         <button 
                             onClick={handleSwap}
                             style={{ flex: '0 0 auto', padding: '0 1rem', background: 'transparent', border: '1px solid var(--n-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', height: '100%', fontSize: '1.25rem' }}
                             title="Swap Units"
                         >
                             ⇄
                         </button>
                         <select
                             value={toUnit}
                             onChange={(e) => setToUnit(e.target.value as AnyUnit)}
                             className="calc-field__input"
                             style={{ flex: 1 }}
                         >
                             <optgroup label="Volume / Liquids">
                                 {Object.entries(VOLUME_UNITS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                             </optgroup>
                             <optgroup label="Mass / Weight">
                                 {Object.entries(MASS_UNITS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                             </optgroup>
                         </select>
                    </div>
                </div>

                {results.needsIngredient && (
                    <div className="calc-field">
                        <label className="calc-field__label">🥄 INGREDIENT DENSITY</label>
                        <select
                            value={ingredient}
                            onChange={(e) => setIngredient(e.target.value as keyof typeof INGREDIENTS)}
                            className="calc-field__input"
                        >
                            {Object.entries(INGREDIENTS).map(([k, v]) => (
                                <option key={k} value={k}>{v.name} ({v.density} g/mL)</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="calc-result">
                <p className="calc-result__label">EXACT CONVERSION</p>
                <p className="calc-result__emi">
                    {results.value} {(VOLUME_UNITS as any)[toUnit]?.name || (MASS_UNITS as any)[toUnit]?.name}
                </p>
                {results.needsIngredient && (
                    <div className="calc-result__stats">
                         <div><p className="calc-result__stat-label">DENSITY FACTORED</p><p className="calc-result__stat-value">{INGREDIENTS[ingredient].density} g/mL</p></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function CookingUniversalConverterCore(props: Props) {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading Universal Engine...</div>}>
            <ConverterLogic {...props} />
        </Suspense>
    );
}

"use client";

import React, { useState, useMemo } from "react";

type Mode = "party" | "baker";
type PizzaSize = "10" | "12" | "14" | "16" | "18";
type HungerLevel = "light" | "average" | "hungry";
type DoughStyle = "neapolitan" | "newyork" | "detroit" | "thin" | "custom";

const PIZZA_DATA: Record<PizzaSize, { label: string; slices: number; area: number; feeds: string }> = {
    "10": { label: "Small (10″)", slices: 6, area: 78.5, feeds: "1–2" },
    "12": { label: "Medium (12″)", slices: 8, area: 113.1, feeds: "2–3" },
    "14": { label: "Large (14″)", slices: 10, area: 153.9, feeds: "3–4" },
    "16": { label: "XL (16″)", slices: 12, area: 201.1, feeds: "4–5" },
    "18": { label: "XXL (18″)", slices: 14, area: 254.5, feeds: "5–7" },
};

const HUNGER_MULTIPLIER: Record<HungerLevel, { slicesAdult: number; slicesChild: number; label: string; emoji: string }> = {
    light: { slicesAdult: 2, slicesChild: 1, label: "Light (sides available)", emoji: "🥗" },
    average: { slicesAdult: 3, slicesChild: 2, label: "Average", emoji: "😋" },
    hungry: { slicesAdult: 4, slicesChild: 3, label: "Hungry (pizza only)", emoji: "🤤" },
};

const DOUGH_PRESETS: Record<DoughStyle, { label: string; emoji: string; hydration: number; salt: number; yeast: number; oil: number; sugar: number; ballWeight: number }> = {
    neapolitan: { label: "Neapolitan", emoji: "🇮🇹", hydration: 62, salt: 2.8, yeast: 0.2, oil: 0, sugar: 0, ballWeight: 250 },
    newyork: { label: "New York", emoji: "🗽", hydration: 64, salt: 2, yeast: 0.4, oil: 2, sugar: 1, ballWeight: 280 },
    detroit: { label: "Detroit / Pan", emoji: "🍞", hydration: 75, salt: 2, yeast: 0.7, oil: 4, sugar: 1.5, ballWeight: 350 },
    thin: { label: "Thin Crust", emoji: "🔪", hydration: 57, salt: 2, yeast: 0.4, oil: 1.5, sugar: 0, ballWeight: 200 },
    custom: { label: "Custom", emoji: "⚙️", hydration: 65, salt: 2.5, yeast: 0.5, oil: 0, sugar: 0, ballWeight: 250 },
};

export default function CookingPizzaCore() {
    // Mode
    const [mode, setMode] = useState<Mode>("party");

    // ── Party Planner State ──
    const [adults, setAdults] = useState(10);
    const [children, setChildren] = useState(0);
    const [hunger, setHunger] = useState<HungerLevel>("average");
    const [pizzaSize, setPizzaSize] = useState<PizzaSize>("14");

    // ── Baker's Lab State ──
    const [doughStyle, setDoughStyle] = useState<DoughStyle>("neapolitan");
    const [doughBalls, setDoughBalls] = useState(4);
    const [ballWeight, setBallWeight] = useState(250);
    const [hydration, setHydration] = useState(62);
    const [salt, setSalt] = useState(2.8);
    const [yeast, setYeast] = useState(0.2);
    const [oil, setOil] = useState(0);
    const [sugar, setSugar] = useState(0);

    // Apply preset
    const applyPreset = (style: DoughStyle) => {
        setDoughStyle(style);
        if (style !== "custom") {
            const p = DOUGH_PRESETS[style];
            setHydration(p.hydration);
            setSalt(p.salt);
            setYeast(p.yeast);
            setOil(p.oil);
            setSugar(p.sugar);
            setBallWeight(p.ballWeight);
        }
    };

    // ── Party Calculation ──
    const partyResults = useMemo(() => {
        const h = HUNGER_MULTIPLIER[hunger];
        const totalSlices = (adults * h.slicesAdult) + (children * h.slicesChild);
        const slicesPerPizza = PIZZA_DATA[pizzaSize].slices;
        const pizzasNeeded = Math.ceil(totalSlices / slicesPerPizza);
        const totalArea = pizzasNeeded * PIZZA_DATA[pizzaSize].area;
        return { totalSlices, pizzasNeeded, totalArea, slicesPerPizza };
    }, [adults, children, hunger, pizzaSize]);

    // ── Baker Calculation ──
    const bakerResults = useMemo(() => {
        const totalDoughWeight = doughBalls * ballWeight;
        const totalPercentage = 100 + hydration + salt + yeast + oil + sugar;
        const flourWeight = totalDoughWeight / (totalPercentage / 100);
        const waterWeight = flourWeight * (hydration / 100);
        const saltWeight = flourWeight * (salt / 100);
        const yeastWeight = flourWeight * (yeast / 100);
        const oilWeight = flourWeight * (oil / 100);
        const sugarWeight = flourWeight * (sugar / 100);
        return {
            flour: flourWeight.toFixed(1),
            water: waterWeight.toFixed(1),
            salt: saltWeight.toFixed(1),
            yeast: yeastWeight.toFixed(1),
            oil: oilWeight.toFixed(1),
            sugar: sugarWeight.toFixed(1),
            total: totalDoughWeight.toFixed(1),
        };
    }, [doughBalls, ballWeight, hydration, salt, yeast, oil, sugar]);

    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        let text: string;
        if (mode === "party") {
            text = `Pizza Order for ${adults} adults${children > 0 ? ` + ${children} kids` : ""}:\n• ${partyResults.pizzasNeeded} ${PIZZA_DATA[pizzaSize].label} pizzas\n• ${partyResults.totalSlices} total slices\n• ${partyResults.totalArea.toFixed(0)} sq inches of pizza`;
        } else {
            text = `Pizza Dough Recipe (${DOUGH_PRESETS[doughStyle].label}):\n• Flour: ${bakerResults.flour}g\n• Water: ${bakerResults.water}g\n• Salt: ${bakerResults.salt}g\n• Yeast: ${bakerResults.yeast}g${parseFloat(bakerResults.oil) > 0 ? `\n• Oil: ${bakerResults.oil}g` : ""}${parseFloat(bakerResults.sugar) > 0 ? `\n• Sugar: ${bakerResults.sugar}g` : ""}\nTotal: ${bakerResults.total}g (${doughBalls} balls × ${ballWeight}g)`;
        }
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const btnBase = "px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border";
    const btnActive = "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 dark:shadow-blue-900/30";
    const btnInactive = "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-blue-300";

    return (
        <div className="calculator-core-layout">
            {/* ── Mode Toggle ── */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setMode("party")}
                    className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 border-2 flex items-center justify-center gap-2
                        ${mode === "party"
                            ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-200 dark:shadow-orange-900/30"
                            : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-orange-300"}`}
                >
                    🍕 Party Planner
                </button>
                <button
                    onClick={() => setMode("baker")}
                    className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 border-2 flex items-center justify-center gap-2
                        ${mode === "baker"
                            ? "bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-200 dark:shadow-amber-900/30"
                            : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-amber-300"}`}
                >
                    🧑‍🍳 Baker&apos;s Lab
                </button>
            </div>

            {/* ═══════════════ PARTY PLANNER ═══════════════ */}
            {mode === "party" && (
                <>
                    <div className="calculator-input-section bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                        {/* Guest Count */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adults</label>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setAdults(Math.max(0, adults - 1))} className="w-10 h-10 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-lg font-bold hover:bg-gray-50 transition-colors">−</button>
                                    <input type="number" min="0" value={adults} onChange={(e) => setAdults(Math.max(0, parseInt(e.target.value) || 0))} className="flex-1 text-center px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                                    <button onClick={() => setAdults(adults + 1)} className="w-10 h-10 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-lg font-bold hover:bg-gray-50 transition-colors">+</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Children</label>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-10 h-10 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-lg font-bold hover:bg-gray-50 transition-colors">−</button>
                                    <input type="number" min="0" value={children} onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))} className="flex-1 text-center px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                                    <button onClick={() => setChildren(children + 1)} className="w-10 h-10 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-lg font-bold hover:bg-gray-50 transition-colors">+</button>
                                </div>
                            </div>
                        </div>

                        {/* Quick Guest Buttons */}
                        <div className="flex gap-2 mb-6 flex-wrap">
                            {[5, 10, 15, 20, 30, 50].map(n => (
                                <button key={n} onClick={() => { setAdults(n); setChildren(0); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${adults === n && children === 0 ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-300" : "bg-gray-100 dark:bg-gray-800 text-gray-500 border border-transparent hover:border-gray-300"}`}>
                                    {n} guests
                                </button>
                            ))}
                        </div>

                        {/* Hunger Level */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hunger Level</label>
                            <div className="grid grid-cols-3 gap-3">
                                {(Object.entries(HUNGER_MULTIPLIER) as [HungerLevel, typeof HUNGER_MULTIPLIER[HungerLevel]][]).map(([key, val]) => (
                                    <button key={key} onClick={() => setHunger(key)}
                                        className={`${btnBase} ${hunger === key ? btnActive : btnInactive} text-center`}>
                                        <span className="block text-lg">{val.emoji}</span>
                                        <span className="block text-xs mt-0.5">{val.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pizza Size */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pizza Size</label>
                            <div className="grid grid-cols-5 gap-2">
                                {(Object.entries(PIZZA_DATA) as [PizzaSize, typeof PIZZA_DATA[PizzaSize]][]).map(([key, val]) => (
                                    <button key={key} onClick={() => setPizzaSize(key)}
                                        className={`${btnBase} text-center py-3 ${pizzaSize === key ? btnActive : btnInactive}`}>
                                        <span className="block text-base font-bold">{key}″</span>
                                        <span className="block text-[10px] mt-0.5 opacity-70">{val.slices} slices</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Party Results */}
                    <div className="calculator-output-section mt-8">
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                            <button onClick={handleCopy} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm">{copied ? "✓ Copied" : "📋 Copy"}</button>
                            <h3 className="text-lg font-bold mb-6 text-white/90">🍕 Pizza Order Summary</h3>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                                    <div className="text-xs uppercase tracking-wider text-white/60 mb-1">Pizzas Needed</div>
                                    <div className="text-4xl font-black">{partyResults.pizzasNeeded}</div>
                                    <div className="text-xs text-white/60 mt-1">{PIZZA_DATA[pizzaSize].label}</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                                    <div className="text-xs uppercase tracking-wider text-white/60 mb-1">Total Slices</div>
                                    <div className="text-4xl font-black">{partyResults.totalSlices}</div>
                                    <div className="text-xs text-white/60 mt-1">{HUNGER_MULTIPLIER[hunger].slicesAdult}/person</div>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                                    <div className="text-xs uppercase tracking-wider text-white/60 mb-1">Total Pizza</div>
                                    <div className="text-4xl font-black">{partyResults.totalArea.toFixed(0)}</div>
                                    <div className="text-xs text-white/60 mt-1">sq inches</div>
                                </div>
                            </div>

                            {/* Pizza emoji grid */}
                            <div className="flex flex-wrap gap-1 justify-center p-3 bg-white/5 rounded-xl">
                                {Array.from({ length: Math.min(partyResults.pizzasNeeded, 30) }).map((_, i) => (
                                    <span key={i} className="text-2xl">🍕</span>
                                ))}
                                {partyResults.pizzasNeeded > 30 && <span className="text-white/60 text-sm self-center ml-2">+{partyResults.pizzasNeeded - 30} more</span>}
                            </div>

                            <div className="mt-4 p-3 bg-white/10 rounded-xl text-sm text-white/80">
                                <strong>💡 Tip:</strong> For a {pizzaSize}″ pizza ({PIZZA_DATA[pizzaSize].area} sq in), each guest gets approximately {(partyResults.totalArea / Math.max(1, adults + children)).toFixed(0)} sq inches of pizza.
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ═══════════════ BAKER'S LAB ═══════════════ */}
            {mode === "baker" && (
                <>
                    <div className="calculator-input-section bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                        {/* Style Presets */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pizza Style</label>
                            <div className="grid grid-cols-5 gap-2">
                                {(Object.entries(DOUGH_PRESETS) as [DoughStyle, typeof DOUGH_PRESETS[DoughStyle]][]).map(([key, val]) => (
                                    <button key={key} onClick={() => applyPreset(key as DoughStyle)}
                                        className={`${btnBase} text-center py-3 ${doughStyle === key ? "bg-amber-600 text-white border-amber-600 shadow-lg shadow-amber-200 dark:shadow-amber-900/30" : btnInactive}`}>
                                        <span className="block text-lg">{val.emoji}</span>
                                        <span className="block text-[10px] mt-0.5">{val.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dough Balls & Weight */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Dough Balls</label>
                                <input type="number" min="1" step="1" value={doughBalls} onChange={(e) => setDoughBalls(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ball Weight (g)</label>
                                <input type="number" min="50" step="10" value={ballWeight} onChange={(e) => { setBallWeight(Math.max(50, parseInt(e.target.value) || 50)); setDoughStyle("custom"); }}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none" />
                            </div>
                        </div>

                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Baker&apos;s Percentages</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Hydration (%)</label>
                                <input type="number" min="40" max="100" step="1" value={hydration} onChange={(e) => { setHydration(parseFloat(e.target.value) || 0); setDoughStyle("custom"); }}
                                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Salt (%)</label>
                                <input type="number" min="0" max="10" step="0.1" value={salt} onChange={(e) => { setSalt(parseFloat(e.target.value) || 0); setDoughStyle("custom"); }}
                                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Yeast (%)</label>
                                <input type="number" min="0" max="10" step="0.01" value={yeast} onChange={(e) => { setYeast(parseFloat(e.target.value) || 0); setDoughStyle("custom"); }}
                                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Oil (%) <span className="text-gray-400">optional</span></label>
                                <input type="number" min="0" max="10" step="0.5" value={oil} onChange={(e) => { setOil(parseFloat(e.target.value) || 0); setDoughStyle("custom"); }}
                                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sugar (%) <span className="text-gray-400">optional</span></label>
                                <input type="number" min="0" max="10" step="0.5" value={sugar} onChange={(e) => { setSugar(parseFloat(e.target.value) || 0); setDoughStyle("custom"); }}
                                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Baker Results */}
                    <div className="calculator-output-section mt-8">
                        <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                            <button onClick={handleCopy} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm">{copied ? "✓ Copied" : "📋 Copy"}</button>
                            <h3 className="text-lg font-bold mb-6 text-white/90">🧑‍🍳 Exact Ingredients — {DOUGH_PRESETS[doughStyle].emoji} {DOUGH_PRESETS[doughStyle].label}</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-white/20 pb-3">
                                    <span className="text-white/80">Flour (100%)</span>
                                    <span className="text-2xl font-bold">{bakerResults.flour}g</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/20 pb-3">
                                    <span className="text-white/80">Water ({hydration}%)</span>
                                    <span className="text-2xl font-bold">{bakerResults.water}g</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/20 pb-3">
                                    <span className="text-white/80">Salt ({salt}%)</span>
                                    <span className="text-2xl font-bold">{bakerResults.salt}g</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/20 pb-3">
                                    <span className="text-white/80">Yeast ({yeast}%)</span>
                                    <span className="text-2xl font-bold">{bakerResults.yeast}g</span>
                                </div>
                                {parseFloat(bakerResults.oil) > 0 && (
                                    <div className="flex justify-between items-center border-b border-white/20 pb-3">
                                        <span className="text-white/80">Oil ({oil}%)</span>
                                        <span className="text-2xl font-bold">{bakerResults.oil}g</span>
                                    </div>
                                )}
                                {parseFloat(bakerResults.sugar) > 0 && (
                                    <div className="flex justify-between items-center border-b border-white/20 pb-3">
                                        <span className="text-white/80">Sugar ({sugar}%)</span>
                                        <span className="text-2xl font-bold">{bakerResults.sugar}g</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-white font-medium">Total Dough ({doughBalls} × {ballWeight}g)</span>
                                    <span className="text-xl font-bold text-amber-100">{bakerResults.total}g</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">Results are estimates. Confirm slice counts and sizing with your pizzeria before ordering.</p>
        </div>
    );
}

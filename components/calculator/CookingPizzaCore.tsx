"use client";

import React, { useState, useMemo } from "react";

export default function CookingPizzaCore() {
    const [doughBalls, setDoughBalls] = useState<number>(4);
    const [ballWeight, setBallWeight] = useState<number>(250);
    const [hydration, setHydration] = useState<number>(65);
    const [salt, setSalt] = useState<number>(2.5);
    const [yeast, setYeast] = useState<number>(0.5);

    const [copied, setCopied] = useState(false);

    // Baker's Percentage Math
    const results = useMemo(() => {
        const totalDoughWeight = doughBalls * ballWeight;
        const totalPercentage = 100 + hydration + salt + yeast;
        
        const flourWeight = totalDoughWeight / (totalPercentage / 100);
        const waterWeight = flourWeight * (hydration / 100);
        const saltWeight = flourWeight * (salt / 100);
        const yeastWeight = flourWeight * (yeast / 100);

        return {
            flour: flourWeight.toFixed(1),
            water: waterWeight.toFixed(1),
            salt: saltWeight.toFixed(1),
            yeast: yeastWeight.toFixed(1),
            total: totalDoughWeight.toFixed(1),
        };
    }, [doughBalls, ballWeight, hydration, salt, yeast]);

    const handleCopy = () => {
        const text = `Pizza Dough Recipe:\n- Flour: ${results.flour}g\n- Water: ${results.water}g\n- Salt: ${results.salt}g\n- Yeast: ${results.yeast}g\nTotal Dough: ${results.total}g (${doughBalls} balls x ${ballWeight}g)`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="calculator-core-layout">
            {/* Input Section */}
            <div className="calculator-input-section bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Dough Balls</label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={doughBalls}
                            onChange={(e) => setDoughBalls(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>
                    <div className="input-group">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dough Ball Weight (g)</label>
                        <input
                            type="number"
                            min="50"
                            step="10"
                            value={ballWeight}
                            onChange={(e) => setBallWeight(Math.max(50, parseInt(e.target.value) || 50))}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Baker's Percentages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="input-group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hydration (%)</label>
                            <input
                                type="number"
                                min="40"
                                max="100"
                                step="1"
                                value={hydration}
                                onChange={(e) => setHydration(parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                        <div className="input-group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salt (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={salt}
                                onChange={(e) => setSalt(parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                        <div className="input-group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Yeast (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.01"
                                value={yeast}
                                onChange={(e) => setYeast(parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Output Section */}
            <div className="calculator-output-section bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white mt-8 shadow-xl relative overflow-hidden">
                <button 
                    onClick={handleCopy}
                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    title="Copy Recipe"
                >
                    {copied ? <span>&#10003; Copied</span> : <span>&#128203; Copy</span>}
                </button>
                
                <h3 className="text-xl font-bold mb-6 text-white/90">Exact Ingredients Recipe</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/20 pb-3">
                        <span className="text-white/80">Flour (100%)</span>
                        <span className="text-2xl font-bold">{results.flour}g</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/20 pb-3">
                        <span className="text-white/80">Water ({hydration}%)</span>
                        <span className="text-2xl font-bold">{results.water}g</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/20 pb-3">
                        <span className="text-white/80">Salt ({salt}%)</span>
                        <span className="text-2xl font-bold">{results.salt}g</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/20 pb-3">
                        <span className="text-white/80">Yeast ({yeast}%)</span>
                        <span className="text-2xl font-bold">{results.yeast}g</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-white font-medium">Total Dough ({doughBalls} × {ballWeight}g)</span>
                        <span className="text-xl font-bold text-blue-100">{results.total}g</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

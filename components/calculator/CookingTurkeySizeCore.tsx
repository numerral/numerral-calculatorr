"use client";

import React, { useState, useMemo } from "react";

export default function CookingTurkeySizeCore() {
    const [adults, setAdults] = useState<number>(10);
    const [children, setChildren] = useState<number>(4);
    const [leftovers, setLeftovers] = useState<"minimal" | "standard">("standard");

    const results = useMemo(() => {
        const equivalentAdults = adults + (children * 0.5);
        const multiplier = leftovers === "minimal" ? 1.0 : 1.5;
        const totalLbs = equivalentAdults * multiplier;
        
        let recommendation = "";
        let splitRecommendation = "";

        if (totalLbs > 22) {
            recommendation = "20+ lbs (Consider two smaller turkeys)";
            splitRecommendation = `Buy two turkeys around ${(totalLbs / 2).toFixed(1)} lbs each for faster, more even cooking.`;
        } else {
            recommendation = `${Math.ceil(totalLbs)} lbs`;
        }

        return {
            totalLbs: totalLbs.toFixed(1),
            recommendation,
            splitRecommendation,
        };
    }, [adults, children, leftovers]);

    return (
        <div className="calculator-core-layout">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Inputs */}
                <div className="bg-orange-50/50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-800">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm mr-2 shadow-sm">1</span>
                        Guest Count
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="input-group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Adults</label>
                            <input
                                type="number"
                                min="1"
                                value={adults}
                                onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="input-group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Children (Under 12)</label>
                            <input
                                type="number"
                                min="0"
                                value={children}
                                onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Calculated as 1/2 of an adult portion.</p>
                        </div>
                        
                        <div className="input-group mt-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Leftover Preference</label>
                            <select
                                value={leftovers}
                                onChange={(e) => setLeftovers(e.target.value as "minimal" | "standard")}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            >
                                <option value="minimal">Minimal Leftovers (1.0 lbs/adult)</option>
                                <option value="standard">Standard Leftovers (1.5 lbs/adult)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Outputs */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-xl flex flex-col justify-center">
                    <p className="text-sm uppercase tracking-wider text-orange-200 font-semibold mb-2">You Should Buy A Turkey Around</p>
                    <h2 className="text-5xl font-extrabold mb-6">
                        {results.recommendation}
                    </h2>
                    
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-orange-100 text-sm">Exact Mathematical Weight</span>
                            <span className="font-semibold">{results.totalLbs} lbs</span>
                        </div>
                        {results.splitRecommendation && (
                            <div className="mt-4 pt-4 border-t border-white/20 text-sm text-yellow-100 font-medium">
                                💡 {results.splitRecommendation}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

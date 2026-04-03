"use client";

import React, { useState, useMemo } from "react";

export default function CookingTurkeyThawCore() {
    const [weight, setWeight] = useState<number>(15);

    const results = useMemo(() => {
        // Fridge: 24 hours per 4.5 lbs (roughly 5.33 hours per lb)
        const fridgeHours = weight * (24 / 4.5);
        const fridgeDays = Math.floor(fridgeHours / 24);
        const fridgeRemHours = Math.floor(fridgeHours % 24);

        // Cold Water: 30 mins per lb
        const waterMinutes = weight * 30;
        const waterHours = Math.floor(waterMinutes / 60);
        const waterRemMins = Math.floor(waterMinutes % 60);

        return {
            fridgeTime: fridgeDays > 0 ? `${fridgeDays} days, ${fridgeRemHours} hrs` : `${Math.floor(fridgeHours)} hrs`,
            waterTime: `${waterHours} hrs, ${waterRemMins} mins`
        };
    }, [weight]);

    return (
        <div className="calculator-core-layout">
            <div className="bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 mb-8 max-w-sm mx-auto text-center">
                <div className="input-group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Frozen Turkey Weight (lbs)</label>
                    <input
                        type="number"
                        min="1"
                        step="0.5"
                        value={weight}
                        onChange={(e) => setWeight(Math.max(1, parseFloat(e.target.value) || 1))}
                        className="w-full text-center px-4 py-3 text-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Refrigerator Method */}
                <div className="bg-white dark:bg-gray-900 border-2 border-cyan-100 dark:border-cyan-900/50 rounded-2xl p-8 relative overflow-hidden group hover:border-cyan-300 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50 dark:bg-cyan-900/20 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">❄️</span>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Refrigerator Thaw</h3>
                    </div>
                    <p className="text-sm text-gray-500 Math.dark:text-gray-400 mb-6 flex-1">
                        <strong>Recommended.</strong> Safe, slow thawing at 40°F. The turkey can remain in the fridge safely for 1-2 days after perfectly thawed.
                    </p>
                    <div className="mt-auto">
                        <p className="text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold mb-1">Time Required</p>
                        <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{results.fridgeTime}</p>
                    </div>
                </div>

                {/* Cold Water Method */}
                <div className="bg-white dark:bg-gray-900 border-2 border-blue-100 dark:border-blue-900/50 rounded-2xl p-8 relative overflow-hidden group hover:border-blue-300 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center mb-4">
                        <span className="text-3xl mr-3">🚰</span>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Cold Water Thaw</h3>
                    </div>
                    <p className="text-sm text-gray-500 Math.dark:text-gray-400 mb-6">
                        <strong>Emergency Only.</strong> Submerge turkey completely in cold tap water. You MUST change the water every 30 minutes to prevent bacteria.
                    </p>
                    <div className="mt-auto">
                        <p className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold mb-1">Time Required</p>
                        <p className="text-4xl font-extrabold text-gray-900 dark:text-white">{results.waterTime}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useState, useMemo } from "react";

export default function CookingTurkeyTimeCore() {
    const [weight, setWeight] = useState<number>(15);
    const [isStuffed, setIsStuffed] = useState<boolean>(false);

    const results = useMemo(() => {
        // USDA standard: Unstuffed ~13-15 mins/lb, Stuffed ~15-18 mins/lb
        const minRate = isStuffed ? 15 : 13;
        const maxRate = isStuffed ? 18 : 15;

        const totalMinMinutes = weight * minRate;
        const totalMaxMinutes = weight * maxRate;

        const minHours = Math.floor(totalMinMinutes / 60);
        const minRem = Math.floor(totalMinMinutes % 60);

        const maxHours = Math.floor(totalMaxMinutes / 60);
        const maxRem = Math.floor(totalMaxMinutes % 60);

        return {
            minTime: `${minHours}h ${minRem}m`,
            maxTime: `${maxHours}h ${maxRem}m`,
            temperature: "325°F (165°C)",
            targetInternal: "165°F (74°C)",
        };
    }, [weight, isStuffed]);

    return (
        <div className="calculator-core-layout">
            <div className="bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 mb-8 max-w-2xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="input-group flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Turkey Weight (lbs)</label>
                        <input
                            type="number"
                            min="1"
                            step="0.5"
                            value={weight}
                            onChange={(e) => setWeight(Math.max(1, parseFloat(e.target.value) || 1))}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="input-group flex-1 relative">
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preparation</label>
                         <select
                                value={isStuffed ? "true" : "false"}
                                onChange={(e) => setIsStuffed(e.target.value === "true")}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                            >
                                <option value="false">Unstuffed</option>
                                <option value="true">Stuffed (Inside Cavity)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mb-2">Oven Temp</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{results.temperature}</p>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-6 text-center shadow-lg text-white">
                    <p className="text-red-100 text-sm font-semibold mb-2 uppercase tracking-wide">Estimated Bake Time</p>
                    <p className="text-2xl font-bold">{results.minTime} - {results.maxTime}</p>
                </div>
                 <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold mb-2">Safe Internal Temp</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-500">{results.targetInternal}</p>
                </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Insert a meat thermometer into the thickest part of the thigh, avoiding the bone. 
                {isStuffed && <strong> The center of the stuffing must also reach 165°F.</strong>}
            </div>
        </div>
    );
}

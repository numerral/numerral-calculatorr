"use client";

import React, { useState, useMemo } from "react";

type HamType = "bone-in" | "boneless" | "spiral";

export default function CookingHamCore() {
    const [adults, setAdults] = useState<number>(10);
    const [hamType, setHamType] = useState<HamType>("bone-in");

    const results = useMemo(() => {
        // Size Math
        let multiplier = 0.5; // default boneless
        if (hamType === "bone-in") multiplier = 0.75;
        if (hamType === "spiral") multiplier = 0.5; // spiral usually bone-in or boneless, but assume high yield
        
        const totalLbs = adults * multiplier;
        const recommendedSize = Math.ceil(totalLbs);

        // Time Math (mins per lb at 325 F)
        let minRate = 15;
        let maxRate = 18;
        if (hamType === "boneless") {
            minRate = 10;
            maxRate = 15;
        } else if (hamType === "spiral") {
            minRate = 10;
            maxRate = 15; // Spiral is very fast to dry out
        }

        const minTotalMinutes = recommendedSize * minRate;
        const maxTotalMinutes = recommendedSize * maxRate;

        const formatTime = (totalMins: number) => {
            const h = Math.floor(totalMins / 60);
            const m = Math.floor(totalMins % 60);
            if (h === 0) return `${m}m`;
            return `${h}h ${m}m`;
        };

        return {
            recommendedLbs: recommendedSize,
            exactLbs: totalLbs.toFixed(1),
            bakeTime: `${formatTime(minTotalMinutes)} - ${formatTime(maxTotalMinutes)}`,
            temp: "325°F (165°C)",
            targetInternal: "140°F (60°C)" // City hams are precooked
        };
    }, [adults, hamType]);

    return (
        <div className="calculator-core-layout">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                {/* Inputs */}
                <div className="flex-1 bg-pink-50/50 dark:bg-pink-900/10 p-6 rounded-2xl border border-pink-100 dark:border-pink-900/30">
                    <div className="space-y-6">
                        <div className="input-group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Number of Guests</label>
                            <input
                                type="number"
                                min="1"
                                value={adults}
                                onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none"
                            />
                        </div>
                        
                        <div className="input-group">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ham Type</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button
                                    onClick={() => setHamType("bone-in")}
                                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${hamType === "bone-in" ? "bg-pink-100 dark:bg-pink-900/50 border-pink-500 text-pink-700 dark:text-pink-300 font-semibold" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 hover:border-pink-300"}`}
                                >
                                    Bone-In
                                </button>
                                <button
                                    onClick={() => setHamType("boneless")}
                                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${hamType === "boneless" ? "bg-pink-100 dark:bg-pink-900/50 border-pink-500 text-pink-700 dark:text-pink-300 font-semibold" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 hover:border-pink-300"}`}
                                >
                                    Boneless
                                </button>
                                <button
                                    onClick={() => setHamType("spiral")}
                                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${hamType === "spiral" ? "bg-pink-100 dark:bg-pink-900/50 border-pink-500 text-pink-700 dark:text-pink-300 font-semibold" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 hover:border-pink-300"}`}
                                >
                                    Spiral Sliced
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Output */}
                <div className="flex-[0.8] bg-white dark:bg-gray-900 border-2 border-pink-100 dark:border-pink-900/50 rounded-2xl p-6 text-center shadow-lg relative flex flex-col justify-center">
                    <p className="text-gray-500 dark:text-gray-400 font-semibold mb-2 uppercase tracking-wide text-sm">Recommended Ham Size</p>
                    <h2 className="text-6xl font-extrabold text-pink-600 dark:text-pink-500 mb-4 tracking-tight">{results.recommendedLbs} <span className="text-3xl font-bold text-gray-400">lbs</span></h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[200px] mx-auto">Calculated at {hamType === "bone-in" ? "0.75" : "0.5"} lbs per person to account for yield.</p>
                </div>
            </div>

            {/* Time & Temp Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 text-center">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Oven Temp</p>
                    <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{results.temp}</p>
                </div>
                <div className="bg-gradient-to-tr from-pink-500 to-rose-500 border border-transparent rounded-2xl p-5 text-center text-white shadow-md">
                    <p className="text-xs text-pink-100 font-semibold uppercase tracking-wider mb-2">Estimated Bake Time</p>
                    <p className="text-xl font-bold">{results.bakeTime}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 text-center">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">Internal Temp</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-500">{results.targetInternal}</p>
                </div>
            </div>
        </div>
    );
}

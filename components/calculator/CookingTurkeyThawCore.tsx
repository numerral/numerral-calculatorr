"use client";

import React, { useState, useMemo } from "react";

type Unit = "lbs" | "kg";

const QUICK_WEIGHTS = [8, 12, 15, 18, 20, 24];

export default function CookingTurkeyThawCore() {
    const [weight, setWeight] = useState<number>(15);
    const [unit, setUnit] = useState<Unit>("lbs");
    const [cookDate, setCookDate] = useState<string>("");

    const weightLbs = unit === "kg" ? weight * 2.20462 : weight;

    const results = useMemo(() => {
        // Fridge: 24 hours per 4.5 lbs
        const fridgeHours = weightLbs * (24 / 4.5);
        const fridgeDays = Math.ceil(fridgeHours / 24);
        const fridgeDaysExact = fridgeHours / 24;
        const fridgeDaysWhole = Math.floor(fridgeDaysExact);
        const fridgeRemHours = Math.round((fridgeDaysExact - fridgeDaysWhole) * 24);

        // Cold Water: 30 mins per lb
        const waterMinutes = weightLbs * 30;
        const waterHours = Math.floor(waterMinutes / 60);
        const waterRemMins = Math.round(waterMinutes % 60);
        const waterChanges = Math.ceil(waterMinutes / 30);

        // Microwave: 6 mins per lb
        const microMinutes = Math.round(weightLbs * 6);
        const microHours = Math.floor(microMinutes / 60);
        const microRemMins = microMinutes % 60;
        const microFeasible = weightLbs <= 14;

        // Start thawing date (fridge method)
        let startDate: string | null = null;
        let startDateObj: Date | null = null;
        if (cookDate) {
            const cook = new Date(cookDate + "T12:00:00");
            if (!isNaN(cook.getTime())) {
                const start = new Date(cook);
                start.setDate(start.getDate() - fridgeDays);
                startDateObj = start;
                startDate = start.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                });
            }
        }

        return {
            fridgeTime: fridgeDaysWhole > 0
                ? `${fridgeDaysWhole} day${fridgeDaysWhole !== 1 ? "s" : ""}${fridgeRemHours > 0 ? `, ${fridgeRemHours} hrs` : ""}`
                : `${Math.round(fridgeHours)} hrs`,
            fridgeDays,
            waterTime: `${waterHours} hrs${waterRemMins > 0 ? `, ${waterRemMins} min` : ""}`,
            waterChanges,
            microTime: microHours > 0
                ? `${microHours} hr${microHours !== 1 ? "s" : ""}${microRemMins > 0 ? `, ${microRemMins} min` : ""}`
                : `${microRemMins} min`,
            microFeasible,
            microMinutes,
            startDate,
            startDateObj,
        };
    }, [weightLbs, cookDate]);

    return (
        <div className="calculator-core-layout">
            {/* ── Input Section ── */}
            <div className="bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 mb-6">
                {/* Unit Toggle + Weight */}
                <div className="flex items-end gap-4 mb-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Frozen Turkey Weight ({unit})
                        </label>
                        <input
                            type="number"
                            min="1"
                            step={unit === "kg" ? "0.5" : "1"}
                            value={weight}
                            onChange={(e) => setWeight(Math.max(1, parseFloat(e.target.value) || 1))}
                            className="w-full text-center px-4 py-3 text-xl font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => { if (unit === "kg") { setWeight(Math.round(weight * 2.20462)); setUnit("lbs"); } }}
                            className={`px-4 py-3 text-sm font-bold transition-all ${unit === "lbs" ? "bg-cyan-600 text-white" : "bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50"}`}
                        >lbs</button>
                        <button
                            onClick={() => { if (unit === "lbs") { setWeight(Math.round(weight / 2.20462 * 10) / 10); setUnit("kg"); } }}
                            className={`px-4 py-3 text-sm font-bold transition-all ${unit === "kg" ? "bg-cyan-600 text-white" : "bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50"}`}
                        >kg</button>
                    </div>
                </div>

                {/* Quick-Select Weight Buttons */}
                <div className="flex gap-2 flex-wrap mb-5">
                    {QUICK_WEIGHTS.map((w) => {
                        const displayW = unit === "kg" ? Math.round(w / 2.20462 * 10) / 10 : w;
                        const isActive = unit === "lbs" ? weight === w : Math.abs(weight - displayW) < 0.2;
                        return (
                            <button
                                key={w}
                                onClick={() => { setWeight(unit === "kg" ? displayW : w); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isActive
                                    ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-300"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 border border-transparent hover:border-gray-300"
                                }`}
                            >
                                {displayW} {unit}
                            </button>
                        );
                    })}
                </div>

                {/* Cook Date Picker — KILLER FEATURE */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <label className="block text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
                        🦃 When are you cooking? <span className="font-normal text-amber-600 dark:text-amber-400">(optional — we&apos;ll tell you when to start thawing)</span>
                    </label>
                    <input
                        type="date"
                        value={cookDate}
                        onChange={(e) => setCookDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    {results.startDate && (
                        <div className="mt-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-amber-300 dark:border-amber-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                📅 <strong className="text-amber-700 dark:text-amber-300">Start thawing in the fridge on:</strong>
                            </p>
                            <p className="text-xl font-black text-gray-900 dark:text-white mt-1">{results.startDate}</p>
                            <p className="text-xs text-gray-500 mt-1">That&apos;s {results.fridgeDays} day{results.fridgeDays !== 1 ? "s" : ""} of fridge thawing for a {weight} {unit} turkey.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Results: 3 Method Cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* ❄️ Refrigerator */}
                <div className="bg-white dark:bg-gray-900 border-2 border-cyan-100 dark:border-cyan-900/50 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-300 transition-colors">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-50 dark:bg-cyan-900/20 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center mb-3">
                        <span className="text-2xl mr-2">❄️</span>
                        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Refrigerator</h3>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 mb-3">RECOMMENDED</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Safe, slow thawing at 40°F. Turkey stays safe for 1–2 days after thawing.
                    </p>
                    <p className="text-xs uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-bold mb-1">Time Required</p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{results.fridgeTime}</p>
                    <p className="text-xs text-gray-400 mt-2">24 hrs per 4–5 lbs</p>
                </div>

                {/* 🚰 Cold Water */}
                <div className="bg-white dark:bg-gray-900 border-2 border-blue-100 dark:border-blue-900/50 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-300 transition-colors">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center mb-3">
                        <span className="text-2xl mr-2">🚰</span>
                        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Cold Water</h3>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 mb-3">EMERGENCY</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Submerge in cold water. Change water every 30 min. Cook immediately.
                    </p>
                    <p className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold mb-1">Time Required</p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{results.waterTime}</p>
                    <p className="text-xs text-gray-400 mt-2">30 min/lb · <strong className="text-blue-600 dark:text-blue-400">{results.waterChanges} water changes</strong></p>
                </div>

                {/* 📡 Microwave */}
                <div className={`bg-white dark:bg-gray-900 border-2 rounded-2xl p-6 relative overflow-hidden group transition-colors ${results.microFeasible ? "border-purple-100 dark:border-purple-900/50 hover:border-purple-300" : "border-red-100 dark:border-red-900/50"}`}>
                    <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full -z-10 transition-transform group-hover:scale-110 ${results.microFeasible ? "bg-purple-50 dark:bg-purple-900/20" : "bg-red-50 dark:bg-red-900/20"}`}></div>
                    <div className="flex items-center mb-3">
                        <span className="text-2xl mr-2">📡</span>
                        <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Microwave</h3>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-3 ${results.microFeasible ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"}`}>
                        {results.microFeasible ? "LAST RESORT" : "TOO LARGE"}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {results.microFeasible
                            ? "Defrost setting, rotate frequently. Cook immediately after."
                            : `A ${Math.round(weightLbs)} lb turkey won't fit in most microwaves. Use fridge or cold water.`
                        }
                    </p>
                    <p className="text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold mb-1">Time Required</p>
                    <p className={`text-3xl font-extrabold ${results.microFeasible ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600 line-through"}`}>{results.microTime}</p>
                    <p className="text-xs text-gray-400 mt-2">6 min/lb on defrost</p>
                </div>
            </div>

            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">All thawing times are USDA estimates. Always verify internal temperature with a meat thermometer before cooking.</p>
        </div>
    );
}
